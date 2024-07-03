import { ServerClient } from 'postmark'
import config from '../config'

const client = new ServerClient(config.email.postmark.key)

export default client