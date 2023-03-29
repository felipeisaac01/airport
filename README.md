# Começando pelo começo

Para conseguir rodar a aplicação em sua máquina, siga os passos abaixo:

1. Rode o comando `npm ci` e espere. Ele instalará as dependencias necessárias.
2. Copie o arquivo `.env.example` para o seu `.env`.
3. Preencha a env `DATABASE_URL` com os acessos para o seu banco de dados de preferência.
4. Após devidamente conectado com o banco de dados, rodar o comando `npm run migration:run`. Este comando rodará as migrations e deixará o banco preparado para a aplicação.
5. Para executar o projeto, rode `npm run dev`. Este comando iniciará o servidor.
6. Para ter autorização para realizar ações, o token obtido no login deve ser utilizado nos headers como `authorization`.

PORÉM, caso não queira rodar localmente ou não tenha um banco de dados disponível, a aplicação está disponível em `https://seashell-app-y4cpw.ondigitalocean.app`.

# Variáveis de ambiente

|      Nome      | Utilização |
|----------------|------------|
|  DATABASE_URL  | Utilizada para fazer a conexão no banco. O padrão mais comum para construção é: `postgresql://user:password@host:port/database_name` |
| JWT_SECRET | Utilizado para encriptar o jwt token.  |

# Sobre o projeto

Este projeto foi construído utilizado express para o servidor e prisma para o banco de dados. Todos os tipos utilizados na aplicação podem ser encontrados em `src/domain/dtos`, enquanto em `src/domain/interfaces` podem ser encontradas as interfaces utilizadas para implementar para erros e para os repositórios.

Ao rodar o projeto pela primeira vez, serão criados dois usuários automaticamente. são eles: 

|   username    | password | permissão |
|---------------|----------|-----------|
| originalAdmin |  123456  |   ADMIN   |
| originalBuyer |  123456  |   BUYER   |

Com estes dois usuários, toda a aplicação pode ser testada. Após o login, o token deve ser fornecido à próxima chamada nos headers, como `authorization`. Importante frisar que o ADMIN pode fazer todas as ações de um BUYER, porém o BUYER não pode fazer ações de ADMIN.

Junto com estes usuários, são criados os aeroportos de SSA, BHZ, NAT, POA, GIG, SDU, GRU E CGH.


# Observações:

1. Para as classes dos voo, foram criadas 5 opções: A, B, C, D e E. São as possibilidades aceitas quando é pedido o `type` da classe.

2. Sobre os valores: todos foram tratados como numeros inteiros. Desta maneira, caso o preço da passagem seja R$100,00, o valor a ser inserido é 10000, o mesmo valor em centavos.

3. Todos os inputs de data e hora, como por exemplo na criação de voos, são divididos em `date` e `time`. O parametro `date` processa datas no padrão `dd/mm/yyyy`, enquanto o time processa horas e minutos no padrão `hh:mm`. Este padrão é imprescindível para o funcionamento do sistema.

4. Os status dos voos podem ser "CANCELED" ou "CONFIRMED".

# Documentação

1. Airports

1.1. GET "/airports"
    
Retorna uma lista de aeroportos disponíveis

- Autorização necessária: BUYER

- paramentros: não há.

- Resposta:

 ```
 [
    {
        "id": string;
        "createdAt": Date;
        "updatedAt": Date;
        "iataCode": string;
        "name": string;
        "city": string;
        "federativeUnit": string;
    },
    .
    .
    .
]
 ```

2. Auth
 
    2.1. POST "/login"

    Retorna um token de autorização para ser utilizado na aplicação.

- Autorização necessária: NENHUMA

- Paramentros:
    - body:

```
{
	"username": string;
	"password": string;
}
```

- Resposta:
```
{
	"token": string;
}
```

3. Flights

3.1. POST "/flight"

Cria um novo vôo

Obs: O parametro `date` processa datas no padrão `dd/mm/yyyy`, enquanto o time processa horas e minutos no padrão `hh:mm`. 

Obs2: O valor será processado como numero inteiro, fazendo-se necessário inserir o valor em centavos.

- Autorização necessária: ADMIN

- Parametros:
    - Body: 
```
{
    departureAirportId: string;
    destinationAirportId: string;
    classes: {
        quantity: number;
        value: number,
        flightId: string;
        type: FlightClassType
    }[];
    departureTime: {
        date: string;
        time: string
    };
}
```
- Resposta: 
```
{
    id: string,
    code: string,
    createdAt: Date,
    departureTime: Date,
    status: string,
    departureAirport: {
        iataCode: string,
        name: string,
        id: string
    },
    destinationAirport: {
        iataCode: string,
        name: string,
        id: string
    },
    flightClasses: {
        value: number,
        quantity: number,
        type: string,
        id: string
    }[],
}
```

3.2. PUT "/flight/:flightId"

Atualiza informações sobre o voo. 

Não é necessário enviar todas as informações, apenas aquelas a serem atualizadas. 

Importante pontuar que por este método não é possível atualizar ou criar classes para o voo. Estas são criadas e atualizadas separadamente.

Obs: O parametro `date` processa datas no padrão `dd/mm/yyyy`, enquanto o time processa horas e minutos no padrão `hh:mm`. 

- Autorização necessária: ADMIN

- Parametros
    - body:
```
{
    departureAirportId: string | undefined;
    destinationAirportId: string | undefined;
    departureTime: {
        date: string;
        time: string
    } | undefined;
    code: string | undefined;
}
```
- Resposta
```
{
    id: string;
    departureTime: Date;
    code: string;
    departureAirport: {
        id: string;
        name: string;
        iataCode: string;
    };
    destinationAirport: {
        id: string;
        name: string;
        iataCode: string;
    };
}
```

3.3. PUT "/flight/:flightId/cancel"

Cancela um vôo.

- Autorização necessária: ADMIN

- Parâmetros: não há.

- Resposta:
```
{
    status: "CANCELED"
}
```

3.4. GET "/flight"

Retorna todos os vôos

- Autorização necessária: ADMIN

- Parâmetros: Não há.

- Resposta:
```
[
    {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        departureTime: Date;
        code: string;
        status: "CANCELED" | "CONFIRMED";
        departureAirport: {
            id: string;
            iataCode: string;
        };
        destinationAirport: {
            id: string;
            iataCode: string;
        };
    },
    .
    .
    .
]
```

3.5. GET "/flight/:flightId/passengers"

Busca os passageiros de um voo

- Autorização necessária: ADMIN

- Parâmetros: não há.

- Resposta:
```
{
    passengers: {
        class: "A" | "B" | "C" | "D" | "E";
        name: string;
        cpf: string;
        birthdate: Date;
        code: string;
    }[]
}
```
4. Flight Class

4.1. POST "flight-class"

cria uma classe para um vôo

Obs: O valor será processado como numero inteiro, fazendo-se necessário inserir o valor em centavos.

- Autorização necessária: ADMIN

- Parâmetros:
    - body:
```
{
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
}
```
- Resposta
```
{
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null
}
```

4.2. PUT "flight-class"

Descrição

- Autorização necessária: ADMIN

- Parâmetros:
    - body:
```
{
    id: string;
    quantity: number | undefined;
    value: number | undefined;
}
```
- Resposta
```
{
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null
}
```

5. Luggage

5.1. GET /luggage/:ticketId/emit

Retorna as informações para a emissão do bilhete de bagagem.

- Autorização necessária: NENHUMA

- Parâmetros: Não há

- Resposta
```
{
    luggageCode: string;
    ticketCode: string;
    passengerName: string;
}
```

6. Tickets

6.1. POST /ticket/:flightId

Realiza a compra de passagens

- Autorização necessária: BUYER

- Parâmetros:
    - Body:
```
{
    classType: "A" | "B" | "C" | "D" | "E";
    passengers: {
        cpf: string,
        birthdate: Date,
        name: string
        luggage: boolean;
    }[]
}
```
- Resposta
```
[
    {
        id: string;
        lugaggeCode: string | undefined,
        code: string,
        passenger: {
            name: string,
            cpf: string,
            birthdate: Date
        },
        flight: {
            departureTime: Date,
            departureAirport: string,
            destinationAirport: string,
            class: FlightClassOptions,
            code: string
        }
    },
    .
    .
    .

]
```

6.2. GET /available-tickets

Busca pelas passagens disponíveis para compra.

Obs: O parametro `date` processa datas no padrão `dd/mm/yyyy`.

- Autorização necessária: BUYER

- Parâmetros:
    - Query:
```
{
    departureAirportCode: string;
    destinationAirportCode: string;
    date: string | undefined;
    minValue: string | undefined;
    maxValue: string | undefined;
}
```
- Resposta
```
[
    {
        flight: {
            id: string
            code: string;
            departureTime: Date;
        };
        tickets: {
            id: string;
            type: FlightClassOptions;
            value: number;
            quantity: number;
        }[]
    },
    .
    .
    .
]
```

6.3. GET /ticket/:ticketId/emit

Retorna as informações para a emissão do bilhete da passagem.

- Autorização necessária: NENHUMA

- Parâmetros: Não há

- Resposta
```
{
    buyerId: string;
    flightCode: string;
    ticketCode: string;
    departureAirport: string;
    destinationAirport: string;
    passenger: {
        cpf: string;
        birthdate: Date;
        name: string;
    },
    luggage: boolean;
}
```

6.4. GET /buyer/:buyerId/tickets

Retorna todas as compras de um usuário comprador.

- Autorização necessária: ADMIN

- Parâmetros: Não há

- Resposta
```
{
    buyer: {
        name: string;
        email:string; 
        cpf: string;
        birthdate: Date;
        tickets: {
            passenger: {
                name: string;
                cpf: string;
                birthdate: Date;
            },
            flight: {
                code: string;
                departureTime: Date;
                departureAirport: {
                    iataCode: string;
                };
                destinationAirport: {
                    iataCode: string;
                };
            };
            id: string;
            luggage: {
                code: string;
            } | null;
            totalValue: number;
            code: string;
            canceled: boolean;
        }[]
    }
}
```

6.5. PUT /ticket/:ticketId/cancel

Realiza o cancelamento de uma compra

- Autorização necessária: BUYER

- Parâmetros: Não há

- Resposta
```
{
    canceledTicket: {
        birthdate: Date;
        cpf: string;
        code: string;
        canceled: boolean;
        name: string;
        totalValue: number;
    }
}
```