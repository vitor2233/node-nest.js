import { BadRequestException, Body, Delete, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";


@Controller('/questions/:id')
export class DeleteQuestionController {
    constructor(
        private deleteQuestion: DeleteQuestionUseCase
    ) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string
    ) {
        const userId = user.sub

        const result = await this.deleteQuestion.execute({
            questionId: questionId,
            authorId: userId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}