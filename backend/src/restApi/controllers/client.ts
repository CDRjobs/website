import { Context } from 'koa'
import {
  CreateClientBodyType,
  UpdateClientBodyType,
  validateCreateClientBody,
  validateUpdateClientBody,
} from './validation/client'
import services from '../../services'
import { ValidationError } from '../errors'

export const createClient = async (ctx: Context) => {
  const body = ctx.request.body as CreateClientBodyType

  await validateCreateClientBody(body)

  const createdClient = await services.client.createClient(body.data.client)

  ctx.body = {
    data: createdClient
  }
}

export const updateClient = async (ctx: Context) => {
  const body = ctx.request.body as UpdateClientBodyType
  const { id } = ctx.params

  const currentClient = await services.client.getClientById(id)

  if (!currentClient) {
    throw new ValidationError("The client you are trying to update doesn't exist. Please, verify the id.")
  }

  await validateUpdateClientBody(body)

  const updatedClient = await services.client.updateClient(id, body.data.client)

  ctx.body = {
    data: updatedClient
  }
}