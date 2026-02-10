global.___loader = {
  enqueue: jest.fn()
}

// Mock IntersectionObserver for widget impression tracking
// eslint-disable-next-line no-unused-vars
global.IntersectionObserver = jest.fn(function (callback, options) {
  this.observe = jest.fn()
  this.disconnect = jest.fn()
  this.unobserve = jest.fn()
})
