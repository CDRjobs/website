import { TransactionalEmailsApi } from '@getbrevo/brevo'
import config from '../config'

const client = new TransactionalEmailsApi()
client.setApiKey(0, config.email.brevo.key)

export default client