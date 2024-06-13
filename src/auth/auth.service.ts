import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { AuthDto } from './dto';
  import * as argon from 'argon2';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  
  

import { throwError } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable() //({}) -> injecting objects here no objects req to be injected in this tutorial
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService,private config:ConfigService){}
    async signup(dto: AuthDto) {
        // generate the password hash
            const hash = await argon.hash(dto.password)

        //save thenw user in db
        try{
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash
            },
            })
       
        //retyrn the saved user
        return this.signToken(user.id,user.email)
        }catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Creds taken')
                }
            }
        }
    }
    async signin(dto :AuthDto) {
        //find the user by email
        console.log('ok')
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        //if not throw error
        if(!user) throw new ForbiddenException('Cred Incorr')
        //compare password 
        const pwMatches = await argon.verify(user.hash,dto.password)
        //if pass incorrect throw exception
        if(!pwMatches) throw new ForbiddenException("Cred error")
        //send bak user
        return this.signToken(user.id,user.email)
    }
    async signToken(userId: number, email:string) : Promise<{'access_token' : string}> {
        const payLoad = {
            sub:userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payLoad,{
            expiresIn : '15m',
            secret:secret
            })
        return {
                    access_token :token,
            }
    }
}

