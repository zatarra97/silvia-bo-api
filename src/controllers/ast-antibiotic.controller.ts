import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, put, post, requestBody, response} from '@loopback/rest';
import {AstAntibiotic} from '../models';
import {AstAntibioticRepository} from '../repositories';

@authenticate('cognito')
export class AstAntibioticController {
  constructor(@repository(AstAntibioticRepository) public repo: AstAntibioticRepository) {}

  @post('/ast-antibiotics')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(AstAntibiotic)}}})
  async create(@requestBody({content: {'application/json': {schema: getModelSchemaRef(AstAntibiotic, {title: 'New', exclude: ['id', 'createdAt', 'updatedAt']})}}})
    data: Omit<AstAntibiotic, 'id' | 'createdAt' | 'updatedAt'>): Promise<AstAntibiotic> {
    return this.repo.create(data);
  }

  @get('/ast-antibiotics/count')
  @response(200, {content: {'application/json': {schema: CountSchema}}})
  async count(@param.where(AstAntibiotic) where?: Where<AstAntibiotic>): Promise<Count> { return this.repo.count(where); }

  @get('/ast-antibiotics')
  @response(200, {content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(AstAntibiotic)}}}})
  async find(@param.filter(AstAntibiotic) filter?: Filter<AstAntibiotic>): Promise<AstAntibiotic[]> { return this.repo.find(filter); }

  @get('/ast-antibiotics/{id}')
  @response(200, {content: {'application/json': {schema: getModelSchemaRef(AstAntibiotic)}}})
  async findById(@param.path.number('id') id: number, @param.filter(AstAntibiotic, {exclude: 'where'}) filter?: FilterExcludingWhere<AstAntibiotic>): Promise<AstAntibiotic> { return this.repo.findById(id, filter); }

  @patch('/ast-antibiotics/{id}')
  @response(204, {description: 'PATCH success'})
  async updateById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(AstAntibiotic, {partial: true})}}}) data: Partial<AstAntibiotic>): Promise<void> { await this.repo.updateById(id, data); }

  @put('/ast-antibiotics/{id}')
  @response(204, {description: 'PUT success'})
  async replaceById(@param.path.number('id') id: number, @requestBody({content: {'application/json': {schema: getModelSchemaRef(AstAntibiotic, {exclude: ['id', 'createdAt', 'updatedAt']})}}}) data: Omit<AstAntibiotic, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> { await this.repo.updateById(id, data); }

  @del('/ast-antibiotics/{id}')
  @response(204, {description: 'DELETE success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> { await this.repo.deleteById(id); }
}
