import { template } from 'lodash/fp'

const subject = '[CDRjobs] Please reset your password'

const htmlTemplate = `
<p>Hello <%- firstname %>,</p>
<p>You forgot your password and requested to reset it. Please follow this link to reset your password:</p>
<p><a href="<%- link %>"><%- link %></a></p>
<p>This link is available for a limited period of time.</p>
<p>If you didn't request to reset your password. Please ignore this message.</p>
<p>CDRjobs</p>`

const textTemplate = `
Hello <%- firstname %>,

You forgot your password and requested to reset it. Please follow this link to reset your password:

<a href="<%- link %>"><%- link %></a>

This link is available for a limited period of time.


If you didn't request to reset your password. Please ignore this message.

CDRjobs
`

const getForgotPasswordEmail = (input: ForgotPasswordTemplateInput) => {
  return {
    subject,
    html: template(htmlTemplate)(input),
    text: template(textTemplate)(input),
  }
}

export type ForgotPasswordTemplateInput = {
  firstname: string,
  link: string,
}

export default getForgotPasswordEmail