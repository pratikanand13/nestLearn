import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
  } from '@nestjs/common';
// import { Body, Controller,HttpStatus,ParseIntPipe,Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from './dto/auth.dto'
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('signup')   
    
    // singup(@Req() req: Request) 
    // singnup(@Body() dto:AuthDto)
    // singnup(@Body('email',ParseIntPipe) email: string)
    signup(@Body() dto:AuthDto)
    {
         //DTO push data from req and run validations
        console.log({dto,
        })
        return this.authService.signup(dto)
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto:AuthDto) {
        
        return this.authService.signin(dto)
    }
 
}