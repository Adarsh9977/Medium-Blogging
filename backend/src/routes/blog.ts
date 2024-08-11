import { createBlogInput, updateBlogInput } from "@adarsh9977/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET:   string
    }, 
    Variables:{
        userId: number,
    }
}>();



blogRouter.use("/*", async (c, next) => {
	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const user = await verify(jwt, c.env.JWT_SECRET);
	if(user){
		// @ts-ignore
		c.set("userId",user.id);
		await next();
	}else{ 
	  return c.json({
		message: "you are not logged in"
	  })
	}
  })

blogRouter.post('/', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	const userId = c.get("userId");
	const body = await c.req.json();
	const {success}= createBlogInput.safeParse(body);
	if(!success){
        c.status(411)
        return  c.json({
            msg: "inputs are not correct"
        })
    }
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

blogRouter.put('/:id', async(c)=>{
	const id = c.req.param("id")
	const body= await c.req.json();
	const {success}= updateBlogInput.safeParse(body);
	if(!success){
        c.status(411)
        return  c.json({
            msg: "inputs are not correct"
        })
    }
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const post = await prisma.post.update({
		where:{
			id: Number(id)
		},
		data: {
			title: body.title,
			content: body.content
		}
	});
	return c.json({
		msg:"updated",
		post
	});
})


blogRouter.get('/bulk', async(c)=>{
	console.log("bulk entry point");
	
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try {
		const blogs = await prisma.post.findMany({
			select:{
				content:true,
				title:true,
				id:true,
				author:{
					select:{
						name:true
					}
				}
			}
		});
		return c.json({
			blogs
		})

	} catch (error) {
		 c.status(411)
		 return c.json({
			msg: "error while getting all posts"
		})
	}
	
})

blogRouter.get('/:id', async(c)=>{
	const id = c.req.param("id");
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try {
		const post = await prisma.post.findFirst({
			where:{
				id: Number(id)
			},
			select:{
				id:true,
				title:true,
				content:true,
				author:{
					select:{
						name:true
					}
				}
			}
		});
		return c.json({
			post
		});
	} catch (error) {
		return c.json({
			error
		})
	}
})

