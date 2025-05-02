import {
  authenticate,
  AuthenticationBindings,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Merchant} from '../models';
import {CategoryItem} from '../models/category-item.model';
import {Category} from '../models/category.model';
import {OpeningHour} from '../models/opening-hour.model';
import {SpecialClosure} from '../models/special-closure.model';
import {MerchantRepository, UserRepository} from '../repositories';

export class MerchantController {
  constructor(
    @repository(MerchantRepository)
    public merchantRepository: MerchantRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/merchants')
  @response(200, {
    description: 'Merchant model instance',
    content: {'application/json': {schema: getModelSchemaRef(Merchant)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {
            title: 'NewMerchant',
            exclude: ['id'],
          }),
        },
      },
    })
    merchant: Omit<Merchant, 'id'>,
  ): Promise<Merchant> {
    return this.merchantRepository.create(merchant);
  }

  @get('/merchants/count')
  @response(200, {
    description: 'Merchant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Merchant) where?: Where<Merchant>,
  ): Promise<Count> {
    return this.merchantRepository.count(where);
  }

  @get('/merchants')
  @response(200, {
    description: 'Array of Merchant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Merchant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Merchant) filter?: Filter<Merchant>,
  ): Promise<Merchant[]> {
    return this.merchantRepository.find(filter);
  }

  @patch('/merchants')
  @response(200, {
    description: 'Merchant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {partial: true}),
        },
      },
    })
    merchant: Merchant,
    @param.where(Merchant) where?: Where<Merchant>,
  ): Promise<Count> {
    return this.merchantRepository.updateAll(merchant, where);
  }

  /*
  @get('/merchants/{id}')
  @response(200, {
    description: 'Merchant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Merchant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Merchant, {exclude: 'where'}) filter?: FilterExcludingWhere<Merchant>
  ): Promise<Merchant> {
    return this.merchantRepository.findById(id, filter);
  }
  */

  @patch('/merchants/{id}')
  @response(204, {
    description: 'Merchant PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Merchant, {partial: true}),
        },
      },
    })
    merchant: Merchant,
  ): Promise<void> {
    await this.merchantRepository.updateById(id, merchant);
  }

  @put('/merchants/{id}')
  @response(204, {
    description: 'Merchant PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() merchant: Merchant,
  ): Promise<void> {
    await this.merchantRepository.replaceById(id, merchant);
  }

  @del('/merchants/{id}')
  @response(204, {
    description: 'Merchant DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.merchantRepository.deleteById(id);
  }

  @get('/public/merchants/open', {
    responses: {
      '200': {
        description: 'Array of open merchants',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string'},
                  slug: {type: 'string'},
                  pickupEnabled: {type: 'boolean'},
                  deliveryEnabled: {type: 'boolean'},
                  deliveryCost: {type: 'number'},
                  minOrderAmount: {type: 'number'},
                  estimatedDeliveryTime: {type: 'string'},
                  coverImageUrl: {type: 'string'},
                  logoUrl: {type: 'string'},
                  openingHours: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        openTime: {type: 'string'},
                        closeTime: {type: 'string'}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async findOpenMerchants(
    @param.query.string('day') day: string,
  ): Promise<Merchant[]> {
    if (!day) {
      throw new Error('Day parameter is required');
    }

    // Validazione del formato della data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(day)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    console.log(`[DEBUG] Ricerca merchant aperti per il giorno: ${day}`);

    // Step 1: Trova i merchant con orari di apertura per il giorno specificato
    const weekdayQuery = `
      SELECT DISTINCT m.${Merchant.COLUMNS.ID}
      FROM ${Merchant.TABLE_NAME} m
      INNER JOIN ${OpeningHour.TABLE_NAME} oh ON oh.${OpeningHour.COLUMNS.MERCHANT_ID} = m.${Merchant.COLUMNS.ID}
      WHERE oh.${OpeningHour.COLUMNS.WEEKDAY} = WEEKDAY(?)
    `;

    console.log('[DEBUG] Esecuzione query per trovare merchant con orari di apertura');
    const merchantIds = await this.merchantRepository.dataSource.execute(weekdayQuery, [day]);
    console.log(`[DEBUG] Trovati ${merchantIds.length} merchant con orari di apertura`);

    if (merchantIds.length === 0) {
      console.log('[DEBUG] Nessun merchant trovato con orari di apertura');
      return [];
    }

    // Step 2: Verifica chiusure speciali
    const closureQuery = `
      SELECT DISTINCT sc.${SpecialClosure.COLUMNS.MERCHANT_ID}
      FROM ${SpecialClosure.TABLE_NAME} sc
      WHERE sc.${SpecialClosure.COLUMNS.DATE} = ?
      AND sc.${SpecialClosure.COLUMNS.MERCHANT_ID} IN (${merchantIds.map((m: any) => m.id).join(',')})
      AND sc.${SpecialClosure.COLUMNS.OPEN_TIME} IS NULL
      AND sc.${SpecialClosure.COLUMNS.CLOSE_TIME} IS NULL
    `;

    console.log('[DEBUG] Verifica chiusure speciali');
    const closedMerchantIds = await this.merchantRepository.dataSource.execute(closureQuery, [day]);
    console.log(`[DEBUG] Trovati ${closedMerchantIds.length} merchant con chiusure speciali`);

    // Step 3: Recupera i dati completi dei merchant aperti
    const openMerchantIds = merchantIds
      .filter((m: any) => !closedMerchantIds.some((cm: any) => cm.merchantId === m.id))
      .map((m: any) => m.id);

    if (openMerchantIds.length === 0) {
      console.log('[DEBUG] Nessun merchant aperto dopo il controllo delle chiusure speciali');
      return [];
    }

    console.log(`[DEBUG] Recupero dati completi per ${openMerchantIds.length} merchant aperti`);
    const finalQuery = `
      SELECT
        m.${Merchant.COLUMNS.ID},
        m.${Merchant.COLUMNS.NAME},
        m.${Merchant.COLUMNS.SLUG},
        m.${Merchant.COLUMNS.PICKUP_ENABLED},
        m.${Merchant.COLUMNS.DELIVERY_ENABLED},
        m.${Merchant.COLUMNS.DELIVERY_COST},
        m.${Merchant.COLUMNS.MIN_ORDER_AMOUNT},
        m.${Merchant.COLUMNS.ESTIMATED_DELIVERY_TIME},
        m.${Merchant.COLUMNS.COVER_IMAGE_URL},
        m.${Merchant.COLUMNS.LOGO_URL},
        oh.${OpeningHour.COLUMNS.OPEN_TIME},
        oh.${OpeningHour.COLUMNS.CLOSE_TIME}
      FROM ${Merchant.TABLE_NAME} m
      INNER JOIN ${OpeningHour.TABLE_NAME} oh ON oh.${OpeningHour.COLUMNS.MERCHANT_ID} = m.${Merchant.COLUMNS.ID}
      WHERE m.${Merchant.COLUMNS.ID} IN (${openMerchantIds.join(',')})
      AND oh.${OpeningHour.COLUMNS.WEEKDAY} = WEEKDAY(?)
      AND m.${Merchant.COLUMNS.VISIBLE} = 1
      ORDER BY m.${Merchant.COLUMNS.NAME}
    `;

    const result = await this.merchantRepository.dataSource.execute(finalQuery, [day]);
    console.log(`[DEBUG] Recuperati ${result.length} record di orari di apertura`);

    // Raggruppa gli orari di apertura per merchant
    const merchantsMap = new Map();
    result.forEach((row: any) => {
      const merchantId = row[Merchant.COLUMNS.ID];
      if (!merchantsMap.has(merchantId)) {
        merchantsMap.set(merchantId, {
          name: row[Merchant.COLUMNS.NAME],
          slug: row[Merchant.COLUMNS.SLUG],
          pickupEnabled: row[Merchant.COLUMNS.PICKUP_ENABLED],
          deliveryEnabled: row[Merchant.COLUMNS.DELIVERY_ENABLED],
          deliveryCost: row[Merchant.COLUMNS.DELIVERY_COST],
          minOrderAmount: row[Merchant.COLUMNS.MIN_ORDER_AMOUNT],
          estimatedDeliveryTime: row[Merchant.COLUMNS.ESTIMATED_DELIVERY_TIME],
          coverImageUrl: row[Merchant.COLUMNS.COVER_IMAGE_URL],
          logoUrl: row[Merchant.COLUMNS.LOGO_URL],
          openingHours: []
        });
      }
      merchantsMap.get(merchantId).openingHours.push({
        openTime: row[OpeningHour.COLUMNS.OPEN_TIME],
        closeTime: row[OpeningHour.COLUMNS.CLOSE_TIME]
      });
    });

    const finalResult = Array.from(merchantsMap.values());
    console.log(`[DEBUG] Restituiti ${finalResult.length} merchant con i loro orari di apertura`);

    return finalResult;
  }

  @get('/public/merchants/{slug}', {
    responses: {
      '200': {
        description: 'Merchant details',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'},
                slug: {type: 'string'},
                address: {type: 'object'},
                pickupEnabled: {type: 'boolean'},
                deliveryEnabled: {type: 'boolean'},
                deliveryCost: {type: 'number'},
                minOrderAmount: {type: 'number'},
                estimatedDeliveryTime: {type: 'string'},
                coverImageUrl: {type: 'string'},
                logoUrl: {type: 'string'},
                openingHours: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      openTime: {type: 'string'},
                      closeTime: {type: 'string'}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async findBySlug(
    @param.path.string('slug') slug: string,
  ): Promise<object> {
    console.log(`[DEBUG] Ricerca merchant con slug: ${slug}`);

    // Step 1: Trova il merchant con lo slug specificato
    const merchantQuery = `
      SELECT
        m.${Merchant.COLUMNS.ID},
        m.${Merchant.COLUMNS.NAME},
        m.${Merchant.COLUMNS.SLUG},
        m.${Merchant.COLUMNS.ADDRESS},
        m.${Merchant.COLUMNS.PICKUP_ENABLED},
        m.${Merchant.COLUMNS.DELIVERY_ENABLED},
        m.${Merchant.COLUMNS.DELIVERY_COST},
        m.${Merchant.COLUMNS.MIN_ORDER_AMOUNT},
        m.${Merchant.COLUMNS.ESTIMATED_DELIVERY_TIME},
        m.${Merchant.COLUMNS.COVER_IMAGE_URL},
        m.${Merchant.COLUMNS.LOGO_URL}
      FROM ${Merchant.TABLE_NAME} m
      WHERE m.${Merchant.COLUMNS.SLUG} = ?
      AND m.${Merchant.COLUMNS.VISIBLE} = 1
    `;

    const merchantResult = await this.merchantRepository.dataSource.execute(merchantQuery, [slug]);

    if (merchantResult.length === 0) {
      throw new Error('Merchant not found');
    }

    const merchant = merchantResult[0];
    console.log(`[DEBUG] Trovato merchant: ${merchant[Merchant.COLUMNS.NAME]}`);

    // Formatta il risultato
    const result = {
      name: merchant[Merchant.COLUMNS.NAME],
      slug: merchant[Merchant.COLUMNS.SLUG],
      address: merchant[Merchant.COLUMNS.ADDRESS],
      pickupEnabled: merchant[Merchant.COLUMNS.PICKUP_ENABLED],
      deliveryEnabled: merchant[Merchant.COLUMNS.DELIVERY_ENABLED],
      deliveryCost: merchant[Merchant.COLUMNS.DELIVERY_COST],
      minOrderAmount: merchant[Merchant.COLUMNS.MIN_ORDER_AMOUNT],
      estimatedDeliveryTime: merchant[Merchant.COLUMNS.ESTIMATED_DELIVERY_TIME],
      coverImageUrl: merchant[Merchant.COLUMNS.COVER_IMAGE_URL],
      logoUrl: merchant[Merchant.COLUMNS.LOGO_URL],
    };

    return result;
  }

  @get('/public/merchants/{slug}/menu', {
    responses: {
      '200': {
        description: 'Menu del merchant organizzato per categorie',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string'},
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {type: 'string'},
                        description: {type: 'string'},
                        price: {type: 'number'},
                        imgUrl: {type: 'string'}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getMenu(
    @param.path.string('slug') slug: string,
  ): Promise<object[]> {
    console.log(`[DEBUG] Ricerca menu per merchant con slug: ${slug}`);

    // Step 1: Trova il merchant
    const merchantQuery = `
      SELECT ${Merchant.COLUMNS.ID}
      FROM ${Merchant.TABLE_NAME}
      WHERE ${Merchant.COLUMNS.SLUG} = ?
      AND ${Merchant.COLUMNS.VISIBLE} = 1
    `;

    const merchantResult = await this.merchantRepository.dataSource.execute(merchantQuery, [slug]);

    if (merchantResult.length === 0) {
      throw new Error('Merchant not found');
    }

    const merchantId = merchantResult[0][Merchant.COLUMNS.ID];
    console.log(`[DEBUG] Trovato merchant con ID: ${merchantId}`);

    // Step 2: Recupera le categorie
    const categoriesQuery = `
      SELECT ${Category.COLUMNS.NAME}
      FROM ${Category.TABLE_NAME}
      WHERE ${Category.COLUMNS.MERCHANT_ID} = ?
      AND ${Category.COLUMNS.VISIBILITY} = 1
      ORDER BY \`${Category.COLUMNS.ORDER}\`, ${Category.COLUMNS.NAME}
    `;

    const categories = await this.merchantRepository.dataSource.execute(categoriesQuery, [merchantId]);
    console.log(`[DEBUG] Trovate ${categories.length} categorie`);

    // Step 3: Per ogni categoria, recupera gli items
    const menu = await Promise.all(categories.map(async (category: any) => {
      const itemsQuery = `
        SELECT
          ${CategoryItem.COLUMNS.ID},
          ${CategoryItem.COLUMNS.NAME},
          ${CategoryItem.COLUMNS.DESCRIPTION},
          ${CategoryItem.COLUMNS.PRICE},
          ${CategoryItem.COLUMNS.IMG_URL}
        FROM ${CategoryItem.TABLE_NAME}
        WHERE ${CategoryItem.COLUMNS.MERCHANT_ID} = ?
        AND ${CategoryItem.COLUMNS.VISIBILITY} = 1
        AND ${CategoryItem.COLUMNS.CATEGORY_ID} = (
          SELECT ${Category.COLUMNS.ID}
          FROM ${Category.TABLE_NAME}
          WHERE ${Category.COLUMNS.MERCHANT_ID} = ?
          AND ${Category.COLUMNS.NAME} = ?
        )
        ORDER BY \`${CategoryItem.COLUMNS.ORDER}\`, ${CategoryItem.COLUMNS.NAME}
      `;

      const items = await this.merchantRepository.dataSource.execute(itemsQuery, [
        merchantId,
        merchantId,
        category[Category.COLUMNS.NAME]
      ]);

      return {
        name: category[Category.COLUMNS.NAME],
        items: items.map((item: any) => ({
          id: item[CategoryItem.COLUMNS.ID],
          name: item[CategoryItem.COLUMNS.NAME],
          description: item[CategoryItem.COLUMNS.DESCRIPTION],
          price: item[CategoryItem.COLUMNS.PRICE],
          imgUrl: item[CategoryItem.COLUMNS.IMG_URL]
        }))
      };
    }));

    console.log(`[DEBUG] Menu completato con ${menu.length} categorie`);
    return menu;
  }

  @authenticate('cognito')
  @get('/merchants/dashboard')
  @response(200, {
    description: 'Dashboard data for merchant',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            today: {
              type: 'object',
              properties: {
                orders: {
                  type: 'object',
                  properties: {
                    count: {type: 'number'},
                    percentageChange: {type: 'number'},
                    breakdown: {
                      type: 'object',
                      properties: {
                        delivery: {type: 'number'},
                        pickup: {type: 'number'}
                      }
                    }
                  }
                },
                revenue: {
                  type: 'object',
                  properties: {
                    total: {type: 'number'},
                    percentageChange: {type: 'number'},
                    avgOrderValue: {type: 'number'}
                  }
                },
                newCustomers: {
                  type: 'object',
                  properties: {
                    count: {type: 'number'},
                    percentageChange: {type: 'number'}
                  }
                },
                peakHours: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      hour: {type: 'number'},
                      orders: {type: 'number'}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getDashboardData(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<object> {
    console.log('[DEBUG] Recupero dati dashboard');
    const userEmail = currentUser.email;

    // Trova l'utente e verifica che sia un merchant
    const user = await this.userRepository.findOne({
      where: {email: userEmail},
      include: [{relation: 'role'}]
    });

    if (!user || user.role?.key !== 'M') {
      throw new HttpErrors.Unauthorized('User is not a merchant');
    }

    // Trova il merchant
    const merchant = await this.merchantRepository.findOne({
      where: {userId: user.id}
    });

    if (!merchant) {
      throw new HttpErrors.NotFound('Merchant not found');
    }

    // Ottieni la data di oggi (inizio e fine giornata)
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Ottieni la data di ieri
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

    // Query per ottenere gli ordini di oggi
    const todayOrdersQuery = `
      SELECT
        COUNT(*) as totalOrders,
        CAST(SUM(total) AS DECIMAL(10,2)) as totalRevenue,
        COUNT(DISTINCT userId) as totalCustomers,
        CAST(SUM(CASE WHEN delivery = 1 THEN 1 ELSE 0 END) AS SIGNED) as deliveryOrders,
        CAST(SUM(CASE WHEN delivery = 0 THEN 1 ELSE 0 END) AS SIGNED) as pickupOrders,
        HOUR(scheduledAt) as orderHour,
        COUNT(*) as ordersPerHour
      FROM \`order\`
      WHERE merchantId = ?
      AND scheduledAt BETWEEN ? AND ?
      GROUP BY HOUR(scheduledAt)
    `;

    // Esegui query per oggi
    const todayStats = await this.merchantRepository.dataSource.execute(todayOrdersQuery, [
      merchant.id,
      startOfToday,
      endOfToday
    ]);

    // Esegui query per ieri (per confronto)
    const yesterdayStats = await this.merchantRepository.dataSource.execute(todayOrdersQuery, [
      merchant.id,
      startOfYesterday,
      endOfYesterday
    ]);

    // Calcola le statistiche
    const todayTotalOrders = parseInt(todayStats.reduce((sum: number, row: any) => sum + Number(row.totalOrders), 0));
    const todayTotalRevenue = parseFloat(todayStats.reduce((sum: number, row: any) => sum + Number(row.totalRevenue), 0).toFixed(2));
    const todayNewCustomers = parseInt(todayStats.reduce((sum: number, row: any) => sum + Number(row.totalCustomers), 0));
    const todayDeliveryOrders = parseInt(todayStats.reduce((sum: number, row: any) => sum + Number(row.deliveryOrders), 0));
    const todayPickupOrders = parseInt(todayStats.reduce((sum: number, row: any) => sum + Number(row.pickupOrders), 0));

    const yesterdayTotalOrders = parseInt(yesterdayStats.reduce((sum: number, row: any) => sum + Number(row.totalOrders), 0));
    const yesterdayTotalRevenue = parseFloat(yesterdayStats.reduce((sum: number, row: any) => sum + Number(row.totalRevenue), 0).toFixed(2));
    const yesterdayNewCustomers = parseInt(yesterdayStats.reduce((sum: number, row: any) => sum + Number(row.totalCustomers), 0));

    // Calcola le variazioni percentuali
    const calculatePercentageChange = (today: number, yesterday: number) => {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return parseFloat(((today - yesterday) / yesterday * 100).toFixed(2));
    };

    // Prepara i dati delle ore di punta
    const peakHours = todayStats
      .map((row: any) => ({
        hour: parseInt(row.orderHour),
        orders: parseInt(row.ordersPerHour)
      }))
      .sort((a: any, b: any) => b.orders - a.orders);

    return {
      today: {
        orders: {
          count: todayTotalOrders,
          percentageChange: calculatePercentageChange(todayTotalOrders, yesterdayTotalOrders),
          breakdown: {
            delivery: todayDeliveryOrders,
            pickup: todayPickupOrders
          }
        },
        revenue: {
          total: todayTotalRevenue,
          percentageChange: calculatePercentageChange(todayTotalRevenue, yesterdayTotalRevenue),
          avgOrderValue: todayTotalOrders > 0 ? parseFloat((todayTotalRevenue / todayTotalOrders).toFixed(2)) : 0
        },
        newCustomers: {
          count: todayNewCustomers,
          percentageChange: calculatePercentageChange(todayNewCustomers, yesterdayNewCustomers)
        },
        peakHours: peakHours
      }
    };
  }
}
