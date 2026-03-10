import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, put, post, requestBody, response} from '@loopback/rest';
import {BsiPathogen} from '../models';
import {BsiPathogenRepository} from '../repositories';

@authenticate('cognito')
export class BsiPathogenController {
  constructor(@repository(BsiPathogenRepository) public repo: BsiPathogenRepository) {}

  @post('/bsi-pathogens')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(BsiPathogen)}}})
  async create(@requestBody({content: {'application/json': {schema: getModelSchemaRef(BsiPathogen, {title: 'New', exclude: ['id', 'createdAt', 'updatedAt']})}}})
    data: Omit<BsiPathogen, 'id' | 'createdAt' | 'updatedAt'>): Promise<BsiPathogen> {
    return this.repo.create(data);
  }

  @get('/bsi-pathogens/count')
  @response(200, {content: {'application/json': {schema: CountSchema}}})
  async count(@param.where(BsiPathogen) where?: Where<BsiPathogen>): Promise<Count> { return this.repo.count(where); }

  @get('/bsi-pathogens')
  @response(200, {content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(BsiPathogen)}}}})
  async find(@param.filter(BsiPathogen) filter?: Filter<BsiPathogen>): Promise<BsiPathogen[]> { return this.repo.find(filter); }

  @get('/bsi-pathogens/{id}')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(BsiPathogen)}}})
  async findById(@param.path.number('id') id: number, @param.filter(BsiPathogen, {exclude: 'where'}) filter?: FilterExcludingWhere<BsiPathogen>): Promise<BsiPathogen> { return this.repo.findById(id, filter); }

  @patch('/bsi-pathogens/{id}')
  @response(204, {description: 'PATCH success'})
  async updateById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(BsiPathogen, {partial: true})}}}) data: Partial<BsiPathogen>): Promise<void> { await this.repo.updateById(id, data); }

  @put('/bsi-pathogens/{id}')
  @response(204, {description: 'PUT success'})
  async replaceById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(BsiPathogen, {exclude: ['id', 'createdAt', 'updatedAt']})}}}) data: Omit<BsiPathogen, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> { await this.repo.updateById(id, data); }

  @del('/bsi-pathogens/{id}')
  @response(204, {description: 'DELETE success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> { await this.repo.deleteById(id); }
}
