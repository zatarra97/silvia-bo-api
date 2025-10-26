import {inject} from '@loopback/core';
import {
  get,
  Request,
  response,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';

/**
 * OpenAPI response for ping() as JSON
 */
const PING_RESPONSE_JSON: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
  ) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE_JSON)
  async ping(): Promise<object> {
    // Reply with a simple response
    return {
      greeting: 'OK',
      date: new Date().toISOString(),
      status: 'online',
    };
  }
}
