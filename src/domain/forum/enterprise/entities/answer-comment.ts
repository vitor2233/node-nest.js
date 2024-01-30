import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { AnswerCommentEvent } from './events/answer-comment-event'

export interface AnswerCommentProps extends CommentProps {
    answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
    get answerId() {
        return this.props.answerId
    }

    static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityID) {
        const answerComment = new AnswerComment({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id)

        const isNewAnswerComment = !id

        if (isNewAnswerComment) {
            answerComment.addDomainEvent(new AnswerCommentEvent(answerComment, answerComment.answerId))
        }

        return answerComment
    }
}