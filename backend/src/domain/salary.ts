const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency', style: 'short' })

export const salaryToText = ({ minSalary, maxSalary, currency }: { minSalary: number | null, maxSalary: number | null, currency: string | null }) => {
  if (!currency || (!minSalary && !maxSalary)) {
    return ''
  }

  let salaryText
  if (minSalary || maxSalary) {
    if (minSalary && maxSalary && minSalary !== maxSalary) {
      salaryText = `${Math.floor(minSalary/1000)}K - ${Math.ceil(maxSalary/1000)}K`
    } else {
      salaryText = `${Math.round((minSalary! || maxSalary!) / 1000)}K`
    }
    salaryText +=  ` (${currencyNames.of(currency.toUpperCase())})`
  }

  return salaryText
}