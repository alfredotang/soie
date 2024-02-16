import validation from '@soie/utils/validation'

export type ValidationParameters = Parameters<typeof validation>

export default function validationFlow(...flow: Array<ValidationParameters>) {
  flow
    .filter(([, , enabled]) => enabled)
    .forEach(params => {
      validation(...params)
    })
}
