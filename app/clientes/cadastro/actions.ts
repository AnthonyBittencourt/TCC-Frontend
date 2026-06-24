"use server"

import { revalidateTag } from "next/cache"
import {cookies} from "next/headers"
import { redirect } from "next/navigation"

interface CreateCliente{
    nome: string,
    email: string,
    cpf:string,
    data_nascimento: string,
    senha: string
    telefone: string,
}

export async function createCliente(cliente: CreateCliente){
    const cookiesStore = await cookies()
    const token = cookiesStore.get("access_token")?.value

    const response = await fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente)
    })

    const data = await response.json();
    if(response.status === 201){
        revalidateTag("listar", "max")
        return;
    }

    if (response.status === 401){
        redirect("/login")
    }
    return data
}