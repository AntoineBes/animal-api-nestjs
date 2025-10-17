import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

interface EspeceDto {
  id: number;
  nom: string;
}

interface AnimalDto {
  id: number;
  nom: string;
  especeId: number;
  statutUICN?: 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'NE';
  ordre?: string;
  famille?: string;
  genre?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  espece?: EspeceDto;
}

interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

describe('App E2E (typed, stable)', () => {
  let app: INestApplication;
  let createdEspeceId: number;
  let createdAnimalId: number;

  // Utilitaires pour générer des noms uniques à chaque run
  const uniq = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /especes -> 201', async () => {
    const especeName = uniq('TestEspece');
    const res = await request(app.getHttpServer()).post('/especes').send({ nom: especeName });
    expect(res.status).toBe(201);
    const body: unknown = res.body;
    expect(body && typeof body === 'object').toBe(true);
    const espece = body as EspeceDto;
    expect(typeof espece.id).toBe('number');
    expect(espece.nom).toBe(especeName);
    createdEspeceId = espece.id;
  });

  it('POST /animaux -> 201', async () => {
    const animalName = uniq('TestAnimal');
    const res = await request(app.getHttpServer())
      .post('/animaux')
      .send({ nom: animalName, especeId: createdEspeceId });
    expect(res.status).toBe(201);
    const body: unknown = res.body;
    expect(body && typeof body === 'object').toBe(true);
    const animal = body as AnimalDto;
    expect(typeof animal.id).toBe('number');
    expect(animal.nom).toBe(animalName);
    expect(animal.especeId).toBe(createdEspeceId);
    createdAnimalId = animal.id;
  });

  it('GET /animaux (paginated or array) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/animaux');
    expect(res.status).toBe(200);
    const bodyUnknown: unknown = res.body;

    if (Array.isArray(bodyUnknown)) {
      const arr = bodyUnknown as AnimalDto[];
      expect(Array.isArray(arr)).toBe(true);
      if (arr.length > 0) {
        expect(typeof arr[0].id).toBe('number');
      }
    } else {
      const page = bodyUnknown as Paginated<AnimalDto>;
      expect(Array.isArray(page.data)).toBe(true);
      if (page.data.length > 0) {
        expect(typeof page.data[0].id).toBe('number');
      }
      expect(typeof page.page).toBe('number');
      expect(typeof page.pageSize).toBe('number');
      expect(typeof page.total).toBe('number');
    }
  });

  it('PATCH /animaux/:id -> 200', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/animaux/${createdAnimalId}`)
      .send({ description: 'MAJ test' });
    expect(res.status).toBe(200);
    const body: unknown = res.body;
    expect(body && typeof body === 'object').toBe(true);
    const animal = body as AnimalDto;
    expect(animal.description).toBe('MAJ test');
  });

  it('DELETE /animaux/:id -> 200', async () => {
    const res = await request(app.getHttpServer()).delete(`/animaux/${createdAnimalId}`);
    expect(res.status).toBe(200);
    const body: unknown = res.body;
    expect(body && typeof body === 'object').toBe(true);
    const animal = body as AnimalDto;
    expect(animal.id).toBe(createdAnimalId);
  });

  it('GET /animaux/:id -> 404 (après suppression)', async () => {
    const res = await request(app.getHttpServer()).get(`/animaux/${createdAnimalId}`);
    // Après suppression, 404 attendu
    expect(res.status).toBe(404);
  });

  it('GET /ready -> 200 when DB OK', async () => {
    const res = await request(app.getHttpServer()).get('/ready');
    expect([200, 503]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toEqual({ status: 'ready' });
    } else {
      expect(res.body).toEqual({ status: 'not-ready' });
    }
  });

  it('GET /live -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/live');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'live' });
  });
});
