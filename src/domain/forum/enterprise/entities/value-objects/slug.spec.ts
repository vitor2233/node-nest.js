import { Slug } from './slug'

test('it should be able to create a new slug from tesxt', () => {
    const slug = Slug.createFromText('A question example--')

    expect(slug.value).toEqual('a-question-example')
})