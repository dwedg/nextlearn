'use server';
import {z} from 'zod'
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation'
import postgres from 'postgres'

import {signIn} from '@/auth'
import {AuthError} from 'next-auth'
const sql = postgres(process.env.POSTGRES_URL!,{ssl:'require'});
//customerId —— Zod 已经会在客户字段为空时抛出错误
//amount —— 由于将金额字段从字符串强制转换为数字，如果字符串为空，它将默认转换为 0。使用 .gt() 方法告诉 Zod：金额必须大于 0。
//status —— Zod 同样会在状态字段为空时抛出错误，因为它只接受 "pending" 或 "paid" 这两种值。
const FormSchema=z.object({
    id:z.string(),
    customerId:z.string({
        invalid_type_error:'Please select a customer.'
    }),
    amount:z.coerce.number().gt(0,{message:'Please enter an amount greater than $0'}),
    status:z.enum(['pending','paid'],{
        invalid_type_error:'Please select an invoice status'
    }),
    date:z.string()
})
//omit闯入一个对象，省略id和data字段，返回一个新的schema
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({id:true,date:true})
//这个state就是ServerAction要返回的结果，如果表单验证通过，该函数不返回任何东西，但是如果表单验证失败，会返回一个包含错误信息的对象。
export type State={
    errors?:{
        customerId?:string[];
        amount?:string[];
        status?:string[];
    };
    message?:string|null
}
export async function createInvoice(prevState: State, formData:FormData){
    //safeParse() 会返回一个包含 success 或 error 字段的对象。这样可以更优雅地处理验证逻辑，而不需要把这些逻辑写在 try/catch 块中。
    const validatedFields =CreateInvoice.safeParse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
     // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
    const amountIncents = amount*100
    const date = new Date().toISOString().split('T')[0];
    try{
        await sql`
        INSERT INTO invoices (customer_id,amount,status,date)
        VALUES(${customerId},${amountIncents},${status},${date})
        `

    }
    catch(e){
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }
    //数据库数据更新，强制刷新invoices page,把最新添加的那条数据在invoices表中呈现
    revalidatePath('/dashboard/invoices')
    //创建新的invoices成功后，回到invoices页面
    redirect('/dashboard/invoices')
}
export async function updateInvoice(id:string,prevState:State,formData:FormData){
    const validatedFields =UpdateInvoice.safeParse({
        customerId:formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status')
    })
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }
    const {customerId,amount,status} = validatedFields.data
    const amountCents = amount*100;
    try{
        await sql`
        UPDATE invoices
        SET customer_id=${customerId},amount=${amountCents},status=${status}
        WHERE id=${id}
        `;
    }
    catch(e){

    }
    revalidatePath('/dashboard/invoices')
    redirect(`/dashboard/invoices`);
}

export async  function deleteInvoice(id:string){
    //测试error.tsx
    // throw Error('delete false')
    await sql`DELETE FROM invoices WHERE id=${id}`
    revalidatePath('/dashboard/invoices')
}

export async function authenticate(
    preSate:string|undefined,
    formData:FormData,
){
    try{
        await signIn('credentials',formData);
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default :
                    return 'Something went wrong';
            }
        }
        throw error;
    }
}