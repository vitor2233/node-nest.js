import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../answer-comment";

export class AnswerCommentEvent implements DomainEvent {
    public ocurredAt: Date
    public answerComment: AnswerComment
    public answerId: UniqueEntityID

    constructor(answerComment: AnswerComment, answerId: UniqueEntityID) {
        this.answerComment = answerComment
        this.answerId = answerId
        this.ocurredAt = new Date()
    }

    getAggregateId(): UniqueEntityID {
        return this.answerComment.id
    }
}