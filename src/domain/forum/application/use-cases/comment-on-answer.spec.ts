import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new CommentOnAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerCommentsRepository,
        )
    })

    it('should be able to comment on answer', async () => {
        const answer = makeAnswer()
        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            authorId: answer.authorId.toString(),
            answerId: answer.id.toString(),
            content: 'Commenting'
        })

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Commenting')
    })
})

