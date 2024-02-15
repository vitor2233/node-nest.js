import { BadRequestException, Body, Delete, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";


@Controller('/answers/:id')
export class DeleteAnswerController {
    constructor(
        private deleteAnswer: DeleteAnswerUseCase
    ) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    ) {
        const userId = user.sub

        const result = await this.deleteAnswer.execute({
            answerId: answerId,
            authorId: userId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}