import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/api/*', cors());

app.get('/', async (c) => {
	return c.text('Welcome!');
});

app.get('/api/:slug/testimonials', async (c) => {
	const { slug } = c.req.param();

	const { results } = await c.env.DB.prepare(
		`
		SELECT * FROM testimonials WHERE post_slug = ?
	`
	)
		.bind(slug)
		.all();

	return c.json(results);
});

app.post('/api/:slug/testimonials', async (c) => {
	const { slug } = c.req.param();
	const { quote, author, role, company, image } = await c.req.json();

	if (!quote) return c.text('Missing quote value for new comment');
	if (!author) return c.text('Missing author value for new comment');
	if (!role) return c.text('Missing role value for new comment');
	if (!company) return c.text('Missing company value for new comment');
	if (!image) return c.text('Missing image value for new comment');

	const { success } = await c.env.DB.prepare(
		`
		INSERT INTO testimonials (quote, author, role, company, image, post_slug) values (?, ?, ?, ?, ?, ?)
		`
	)
		.bind(quote, author, role, company, image, slug)
		.run();

	if (success) {
		c.status(201);
		return c.text('Created');
	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});

app.delete('/api/:slug/testimonials/:id', async (c) => {
	const { slug, id } = c.req.param();

	// First verify that the testimonial exists and belongs to the specified slug
	const existing = await c.env.DB.prepare(`SELECT id FROM testimonials WHERE id = ? AND post_slug = ?`).bind(id, slug).first();

	if (!existing) {
		c.status(404);
		return c.text('Testimonial not found or does not belong to this post');
	}

	const { success } = await c.env.DB.prepare(`DELETE FROM testimonials WHERE id = ?`).bind(id).run();

	if (success) {
		return c.text('Deleted');
	} else {
		c.status(500);
		return c.text('Something went wrong');
	}
});

export default app;
