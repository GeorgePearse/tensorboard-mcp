import { RunService } from '../../services/RunService.js';
import { TensorBoardClient } from '../../api/TensorBoardClient.js';
import { Run, ScalarData } from '../../types/index.js';

// Mock the TensorBoardClient
jest.mock('../../api/TensorBoardClient.js');

describe('RunService', () => {
  let runService: RunService;
  let mockClient: jest.Mocked<TensorBoardClient>;

  beforeEach(() => {
    mockClient = new TensorBoardClient('http://localhost:6006') as jest.Mocked<TensorBoardClient>;
    runService = new RunService(mockClient);
  });

  describe('listRuns', () => {
    it('should return all runs when no filter is provided', async () => {
      const mockRuns: Run[] = [
        { name: 'run1' },
        { name: 'run2' },
        { name: 'experiment/run3' },
      ];
      mockClient.listRuns.mockResolvedValue(mockRuns);

      const result = await runService.listRuns();

      expect(result).toEqual(mockRuns);
      expect(mockClient.listRuns).toHaveBeenCalledTimes(1);
    });

    it('should filter runs by regex pattern', async () => {
      const mockRuns: Run[] = [
        { name: 'train/run1' },
        { name: 'train/run2' },
        { name: 'test/run3' },
      ];
      mockClient.listRuns.mockResolvedValue(mockRuns);

      const result = await runService.listRuns('^train/');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('train/run1');
      expect(result[1].name).toBe('train/run2');
    });

    it('should fall back to string matching for invalid regex', async () => {
      const mockRuns: Run[] = [
        { name: 'run[1]' },
        { name: 'run[2]' },
        { name: 'other' },
      ];
      mockClient.listRuns.mockResolvedValue(mockRuns);

      // Invalid regex pattern
      const result = await runService.listRuns('run[');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('run[1]');
      expect(result[1].name).toBe('run[2]');
    });
  });

  describe('compareRuns', () => {
    it('should compare metrics across multiple runs', async () => {
      const mockRuns: Run[] = [
        { name: 'run1' },
        { name: 'run2' },
      ];
      mockClient.listRuns.mockResolvedValue(mockRuns);

      const mockScalarData: ScalarData[] = [
        { wall_time: 1, step: 0, value: 0.5 },
        { wall_time: 2, step: 1, value: 0.3 },
        { wall_time: 3, step: 2, value: 0.1 },
      ];

      mockClient.getRunTags.mockResolvedValue({ loss: [] });
      mockClient.getScalars.mockResolvedValue(mockScalarData);

      const result = await runService.compareRuns(['run1', 'run2'], 'loss');

      expect(result.run1).toBeDefined();
      expect(result.run2).toBeDefined();
      expect(result._summary).toBeDefined();
      expect(result._summary.best_final_value.runId).toBe('run1');
    });

    it('should handle missing runs gracefully', async () => {
      const mockRuns: Run[] = [
        { name: 'run1' },
      ];
      mockClient.listRuns.mockResolvedValue(mockRuns);

      const result = await runService.compareRuns(['run1', 'run2'], 'loss');

      expect(result.run1).toBeDefined();
      expect(result.run2.error).toBe('Run "run2" not found');
    });
  });
});