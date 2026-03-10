import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, put, post, requestBody, response} from '@loopback/rest';
import {ResistanceProfile} from '../models';
import {ResistanceProfileRepository} from '../repositories';

@authenticate('cognito')
export class ResistanceProfileController {
  constructor(@repository(ResistanceProfileRepository) public repo: ResistanceProfileRepository) {}

  @post('/resistance-profiles')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(ResistanceProfile)}}})
  async create(@requestBody({content: {'application/json': {schema: getModelSchemaRef(ResistanceProfile, {title: 'New', exclude: ['id', 'createdAt', 'updatedAt']})}}})
    data: Omit<ResistanceProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResistanceProfile> {
    return this.repo.create(data);
  }

  @get('/resistance-profiles/count')
  @response(200, {content: {'application/json': {schema: CountSchema}}})
  async count(@param.where(ResistanceProfile) where?: Where<ResistanceProfile>): Promise<Count> { return this.repo.count(where); }

  @get('/resistance-profiles')
  @response(200, {content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(ResistanceProfile)}}}})
  async find(@param.filter(ResistanceProfile) filter?: Filter<ResistanceProfile>): Promise<ResistanceProfile[]> { return this.repo.find(filter); }

  @get('/resistance-profiles/{id}')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(ResistanceProfile)}}})
  async findById(@param.path.number('id') id: number, @param.filter(ResistanceProfile, {exclude: 'where'}) filter?: FilterExcludingWhere<ResistanceProfile>): Promise<ResistanceProfile> { return this.repo.findById(id, filter); }

  @patch('/resistance-profiles/{id}')
  @response(204, {description: 'PATCH success'})
  async updateById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(ResistanceProfile, {partial: true})}}}) data: Partial<ResistanceProfile>): Promise<void> { await this.repo.updateById(id, data); }

  @put('/resistance-profiles/{id}')
  @response(204, {description: 'PUT success'})
  async replaceById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(ResistanceProfile, {exclude: ['id', 'createdAt', 'updatedAt']})}}}) data: Omit<ResistanceProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> { await this.repo.updateById(id, data); }

  @del('/resistance-profiles/{id}')
  @response(204, {description: 'DELETE success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> { await this.repo.deleteById(id); }
}
