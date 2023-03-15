export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'userName',
      type: 'string'
    },
    {
      name: 'rate',
      title: 'Rate',
      type: 'number',
      validation: Rule => Rule.min(0).max(5)
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'string'
    }
  ]
}
