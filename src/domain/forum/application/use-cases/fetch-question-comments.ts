import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(
        private questionCommentsRespository: QuestionCommentsRepository,
    ) { }

    async execute({ page, questionId
    }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionCommentsRespository.findManyByQuestionId(questionId, { page })

        return right({
            questionComments
        })
    }
}