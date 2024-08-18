import { Discipline } from '@prisma/client'

const disciplineMap = {
  strategyAndConsulting: 'Strategy and Consulting',
  sustainability: 'Sustainability',
  operationsAndProjectManagement: 'Operations and Project Management',
  researchAndDevelopment: 'Research and Development',
  businessDevelopmentAndSales: 'Business Development and Sales',
  policy: 'Policy',
  engineering: 'Engineering',
  marketingAndCommunications: 'Marketing and Communications',
  administrativeAndSupport: 'Administrative and Support',
  financialAndLegal: 'Financial and Legal',
  softwareEngineering: 'Software Engineering',
  humanResourcesAndPeopleManagement: 'Human Resources and People Management',
  maintenanceAndTechnicians: 'Maintenance and Technicians',
}

export const toDisciplineText = (discipline: Discipline) => {
  return disciplineMap[discipline]
}