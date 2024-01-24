import { UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { z } from "zod";

const createQuestionBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor() { }

    @Post()
    async handle() {
        return 'ok'
    }
}