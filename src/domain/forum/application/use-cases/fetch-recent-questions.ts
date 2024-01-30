import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseCaseRequest {
    page: number
}

type FetchRecentQuestionsUseCaseCaseResponse = Either<null, { questions: Question[] }>

export class FetchRecentQuestionsUseCaseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) { }

    async execute({ page
    }: FetchRecentQuestionsUseCaseCaseRequest): Promise<FetchRecentQuestionsUseCaseCaseResponse> {
        const questions = await this.questionsRepository.findManyRecent({ page })

        return right({
            questions
        })
    }
}