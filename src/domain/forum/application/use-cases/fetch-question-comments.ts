import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseCaseResponse = Either<null, { questionComments: QuestionComment[] }>

export class FetchQuestionCommentsUseCaseCase {
    constructor(
        private questionCommentsRespository: QuestionCommentsRepository,
    ) { }

    async execute({ page, questionId
    }: FetchQuestionCommentsUseCaseCaseRequest): Promise<FetchQuestionCommentsUseCaseCaseResponse> {
        const questionComments = await this.questionCommentsRespository.findManyByQuestionId(questionId, { page })

        return right({
            questionComments
        })
    }
}