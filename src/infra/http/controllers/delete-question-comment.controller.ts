import { BadRequestException, Body, Delete, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";


@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
    constructor(
        private deleteQuestionComment: DeleteQuestionCommentUseCase
    ) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionCommentId: string
    ) {
        const userId = user.sub

        const result = await this.deleteQuestionComment.execute({
            questionCommentId,
            authorId: userId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}