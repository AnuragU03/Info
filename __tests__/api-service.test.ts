import { MicroserviceAPI } from '../lib/api-service';

describe('MicroserviceAPI', () => {
  let api: MicroserviceAPI;

  beforeEach(() => {
    api = new MicroserviceAPI();
    // @ts-ignore
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('searchVillage calls proxied endpoint and returns data', async () => {
    const mockResponse = {
      primary_attractions: ['Temple', 'Viewpoint'],
      local_specialties: ['Handicrafts'],
      activities: ['Trekking']
    };

    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await api.searchVillage('test village');
    expect(result).toEqual(mockResponse);
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalled();
  });
});
