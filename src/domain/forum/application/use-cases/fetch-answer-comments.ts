import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseCaseResponse = Either<null, { answerComments: AnswerComment[] }>

export class FetchAnswerCommentsUseCaseCase {
    constructor(
        private answerCommentsRespository: AnswerCommentsRepository,
    ) { }

    async execute({ page, answerId
    }: FetchAnswerCommentsUseCaseCaseRequest): Promise<FetchAnswerCommentsUseCaseCaseResponse> {
        const answerComments = await this.answerCommentsRespository.findManyByAnswerId(answerId, { page })

        return right({
            answerComments
        })
    }
}