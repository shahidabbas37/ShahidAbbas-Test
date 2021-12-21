//import * as Joi from 'joi'
//Joi.extend('@jio/date')
// const Joi = require('joi')
// .extend(require('@joi/date'));
import * as joi from 'joi';
import JoiDate from '@joi/date';
const Joi = joi.extend(JoiDate);

const employeeSchema = Joi.object({
    fulllName: Joi.string().min(5).max(20).required(),
    dateOfBirth: Joi.date().format('YYYY-MM-DD').required(),
    address: Joi.string().min(5).required(),
    jobRole: Joi.string().min(5).required(),
    fullTime: Joi.boolean().required(),
    contractLengthDays: Joi.number().min(365).required(),
    department: Joi.string().min(5).required(),
    salary: Joi.number().min(2000).required(),
    dateJoined: Joi.date().format('YYYY-MM-DD').required(),
    status: Joi.string().required(),
    phone: Joi.string().min(13).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    //.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) allow .com and .net
})

const updateEmployeeSchema = Joi.object({
    fullName: Joi.string().min(5).max(20),
    dateOfBirth: Joi.date().format('YYYY-MM-DD'),
    address: Joi.string().min(5),
    status: Joi.string(),
    phone: Joi.string().min(13),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

})

const attendanceSchema = Joi.object({
    date: Joi.date().format('YYYY-MM-DD').required(),
    in: Joi.date().iso().required(),
    out: Joi.date().iso().greater(Joi.ref('in')).required()


})

const payrollSchema = Joi.object({
    salary: Joi.number().min(10000).required(),
    medicalWithheld: Joi.number().min(1000).required(),
    taxPercentWithheld: Joi.number().min(200).required(),



})



export {
    payrollSchema,
    employeeSchema,
    updateEmployeeSchema,
    attendanceSchema
} 