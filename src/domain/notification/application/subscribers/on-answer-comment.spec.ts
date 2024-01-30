import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"

import { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { OnAnswerComment } from "./on-answer-comment"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<[SendNotificationUseCaseRequest], Promise<SendNotificationUseCaseResponse>>

describe('Answer Comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
        sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')
        new OnAnswerComment(inMemoryAnswersRepository, sut)
    })
    it('should send a notification when an answer has a comment', async () => {
        const answer = makeAnswer()
        const answerComment = makeAnswerComment({ answerId: answer.id })

        inMemoryAnswersRepository.create(answer)
        inMemoryAnswerCommentsRepository.create(answerComment)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})