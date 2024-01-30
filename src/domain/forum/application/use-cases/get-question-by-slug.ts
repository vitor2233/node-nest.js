import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseCaseRequest {
    slug: string
}

type GetQuestionBySlugUseCaseCaseResponse = Either<ResourceNotFoundError, { question: Question }>

export class GetQuestionBySlugUseCaseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) { }

    async execute({ slug
    }: GetQuestionBySlugUseCaseCaseRequest): Promise<GetQuestionBySlugUseCaseCaseResponse> {
        const question = await this.questionsRepository.findBySlug(slug)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        await this.questionsRepository.create(question)

        return right({
            question
        })
    }
}