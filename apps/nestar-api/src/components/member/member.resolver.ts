import { Mutation, Resolver, Query } from '@nestjs/graphql';
import { MemberService } from './member.service';
// import { Query } from '@nestjs/common';

@Resolver()
export class MemberResolver {
    constructor( private readonly memberService: MemberService) {}
    
    // Query[GET] & mutation[REST API]
   
    @Mutation(() => String)
    public async singup(): Promise<string> {
        console.log("Mutation: signup");
        return this.memberService.signup();
    }

    @Mutation(() => String)
    public async login(): Promise<string> {
        console.log("Mutation: login");
        return this.memberService.login();
    }

    @Mutation(() => String)
    public async updateMember(): Promise<string> {
        console.log("Mutation: updateMember");
        return this.memberService.updateMember();
    }

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Query: getMember");
        return this.memberService.getMember();
    }
}
