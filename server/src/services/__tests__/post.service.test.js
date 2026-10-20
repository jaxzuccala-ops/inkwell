// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
};

const mockEventBus = {
  emit: jest.fn(),
};

jest.unstable_mockModule(
  "../../repositories/post.repository.js",
  () => ({
    PostRepository: mockPostRepository,
  })
);

jest.unstable_mockModule(
  "../../events/event-bus.js",
  () => ({
    EventBus: mockEventBus,
  })
);

const { PostService } = await import("../post.service.js");

test(
  "publish() creates a PUBLISHED post and emits post.published",
  async () => {
    mockPostRepository.createWithTags.mockResolvedValue({
      id: "p1",
      title: "Hello",
      status: "PUBLISHED",
    });

    const post = await PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World",
    });

    expect(post.status).toBe("PUBLISHED");

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      "post.published",
      expect.objectContaining({
        postId: "p1",
      })
    );
  }
);

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({
      authorId: "u1",
      title: "",
      body: "World",
    })
  ).rejects.toThrow();
});

test("publish() rejects an empty body", async () => {
  await expect(
    PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "",
    })
  ).rejects.toThrow();
});

test("publish() includes tags in the emitted event", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
    tagNames: ["design", "architecture"],
  });

  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({
      tags: ["design", "architecture"],
    })
  );
});

test("publish() sends the authorId in the emitted event", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
  });

  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({
      authorId: "u1",
    })
  );
});

test("publish() passes the correct data to PostRepository", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
    tagNames: ["design"],
  });

  expect(mockPostRepository.createWithTags).toHaveBeenCalledWith(
    expect.objectContaining({
      authorId: "u1",
      title: "Hello",
      body: "World",
      tagNames: ["design"],
      status: "PUBLISHED",
    })
  );
});

test("publish() propagates repository errors", async () => {
  mockPostRepository.createWithTags.mockRejectedValue(
    new Error("Database unavailable")
  );

  await expect(
    PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World",
    })
  ).rejects.toThrow("Database unavailable");
});