import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { addMinutes } from 'date-fns'
import { pick } from 'lodash/fp'
import prisma from '../../db/prisma'
import config from '../../config'

type SafeUser = Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'verifiedEmail'>
type ForgotPasswordUser = Pick<User, 'id' | 'email' | 'firstname' | 'lastname' | 'verifiedEmail' | 'forgotPasswordToken'>

const safeUserSelect = { id: true, email: true, firstname: true, lastname: true, verifiedEmail: true }
const forgotPasswordUserSelect = { ...safeUserSelect, forgotPasswordToken: true }

const sanitizeUser = (user: User): SafeUser => pick(Object.keys(safeUserSelect))(user) as unknown as SafeUser

const hashPassword = async (password: string) => bcrypt.hash(password, 12)

const doesUserExist = async (email: string): Promise<boolean> => {
  const count = await prisma.user.count({
    where: {
      email: email.toLowerCase(),
    }
  })

  return !!count
}

const getUserById = async (id: string): Promise<SafeUser|null> => {
  const user = await prisma.user.findUnique({ select: safeUserSelect, where: { id } })

  return user
}

const getUserByIdAndForgotPasswordToken = async ({ id, token }: { id: string, token: string}): Promise<SafeUser|null> => {
  const user = await prisma.user.findUnique({ select: safeUserSelect, where: { id, forgotPasswordToken: token } })

  return user
}

const getUserByEmail = async (email: string): Promise<SafeUser|null> => {
  const user = await prisma.user.findUnique({ select: safeUserSelect, where: { email: email.toLowerCase() } })

  return user
}

const createUser = async ({ firstname, lastname, email, password }: {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
}): Promise<SafeUser> => {
  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    select: safeUserSelect,
    data: {
      email: email.toLowerCase(),
      passwordHash,
      firstname,
      lastname
    },
  })
 
  return user
}

const updateUserPassword = async (id: string, newPassword: string) => {
  const passwordHash = await hashPassword(newPassword)
  const user = await prisma.user.update({
    select: safeUserSelect,
    where: { id },
    data: {
      passwordHash,
      forgotPasswordToken: null
    },
  })

  return user
}

const getUserByCredentials = async ({ email, password }: { email: string, password: string }): Promise<SafeUser|null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  })

  if (!user) {
    return null
  }

  const match = await bcrypt.compare(password, user.passwordHash)

  return match ? sanitizeUser(user) : null
}

const deleteUser = async (id: string): Promise<SafeUser> => {
  const user = await getUserById(id)

  if (!user) {
    throw new Error("Can't delete user because it doesn't exist")
  }

  await prisma.user.delete({ where: { id } })

  return user
}

const addForgetPasswordTokenFor = async (id: string): Promise<ForgotPasswordUser> => {
  const forgotPasswordToken = await jwt.sign({
    name: 'Reset password',
    expire: addMinutes(new Date(), 15),
  }, config.jwt.key)

  const user = await prisma.user.update({
    select: forgotPasswordUserSelect,
    where: { id },
    data: { forgotPasswordToken }
  })

  return user
}

export default {
  doesUserExist,
  getUserById,
  getUserByIdAndForgotPasswordToken,
  getUserByEmail,
  createUser,
  updateUserPassword,
  getUserByCredentials,
  deleteUser,
  addForgetPasswordTokenFor,
}