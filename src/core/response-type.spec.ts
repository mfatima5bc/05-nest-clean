import { ResponseType, error, success } from '@/core/response-type';

function doSomeThing(shouldSuccess: boolean): ResponseType<string, number> {
  if (shouldSuccess) {
    return success(10);
  } else {
    return error('error');
  }
}

test('success result', () => {
  const result = doSomeThing(true);

  expect(result.isSuccess()).toBe(true);
  expect(result.isError()).toBe(false);
});

test('error result', () => {
  const result = doSomeThing(false);

  expect(result.isError()).toBe(true);
  expect(result.isSuccess()).toBe(false);
});
