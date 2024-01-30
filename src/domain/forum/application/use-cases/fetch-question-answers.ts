import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseCaseRequest {
    page: number
    questionId: string
}

type FetchQuestionAnswersUseCaseCaseResponse = Either<null, { answers: Answer[] }>

export class FetchQuestionAnswersUseCaseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) { }

    async execute({ page, questionId
    }: FetchQuestionAnswersUseCaseCaseRequest): Promise<FetchQuestionAnswersUseCaseCaseResponse> {
        const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

        return right({
            answers
        })
    }
}