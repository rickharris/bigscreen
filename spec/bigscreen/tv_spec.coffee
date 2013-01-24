describe "Bigscreen.Tv", ->
  it "adds the paused state class to the container", ->
    loadFixtures('video.html')
    video = document.getElementById('video')
    container = $(video.parentNode)
    expect(container).not.toHaveClass('bigscreen-is-paused')
    new Bigscreen.Tv(video)
    expect(container).toHaveClass('bigscreen-is-paused')
