import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentEvent } from "@/domain/forum/enterprise/entities/events/answer-comment-event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerComment implements EventHandler {
    constructor(
        private answersRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(this.sendAnswerCommentNotification.bind(this), AnswerCommentEvent.name)
    }

    private async sendAnswerCommentNotification({ answerComment, answerId }: AnswerCommentEvent) {
        const answer = await this.answersRepository.findById(answerId.toString())

        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `You have a new comment in your answer`,
                content: `Your answer "${answer.content.substring(0, 20).concat('...')}
                " has a new comment`
            })
        }
    }
}