import { Body, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/auth/current-user-decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(
        private prisma: PrismaService
    ) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body
        const userId = user.sub

        await this.prisma.question.create({
            data: {
                title,
                content,
                slug: this.convertToSlug(title),
                authorId: userId
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
    }
}