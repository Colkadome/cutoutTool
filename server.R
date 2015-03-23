library(png)
library(FITSio)
library(astro)

ovals = list()
c(ovals,
  list(
      "x"=20,
      "y"=20,
      "raX"=20,
      "raY"=20,
      "rot"=0.4
  )
)

shinyServer(function(input, output, session) {
    
    getBackground = reactive({
        testImg = readPNG("www/test2.png")
        pixels = testImg[,,1] # get red pixels?
        return=image(x=1:200,
                     y=1:200,
                     z=pixels,
                     col=rainbow(100,start=0.6,end=1.0),
                     xlab="xlab",
                     ylab="ylab")
    })
    
    output$plot1=renderPlot({
        
        # output back image
        getBackground()

        if(!is.null(input$click1)) {
            
            # output ovals
            par(new=TRUE)
            image(x=1:200,
                  y=1:200,
                  z=matrix(c(1,NA,NA,NA),nrow=200,ncol=200),
                  col=rainbow(100,start=(input$click1$x/200),end=1.0),
                  ann=F,
                  xaxt="n",
                  yaxt="n")
        }
    })
    
    observe({
        print(paste("mouse:",input$click1$x,input$click1$y))
    })
    
#     output$image1 <- renderImage({
#         width = 400
#         height = 400
#         outfile = tempfile(fileext = ".png")
#         
#         # Generate the image and write it to file
#         pic = drawCircle(input$click1$x,input$click1$y, 400, 400, 10)
#         
#         writePNG(pic, target = outfile)
#         list(src = outfile,
#              contentType = "image/png",
#              width = width,
#              height = height,
#              alt = "This is alternate text")
#         
#     }, deleteFile = TRUE)
    
})

# drawCircle = function(xC,yC,w,h,radius) {
#     # PIXEL -> UNITS CONVERSION
#     x = xC * 4
#     y = yC * 4
#     
#     # init pixel matrix
#     yA = rep(h:1,w)
#     xA = c()
#     for (i in 1:h) {
#         xA = c(xA, rep(i,w))
#     }
#     
#     pic = array(0,c(h,w,2))
#     pic[,,2] = ((x-xA)^2 + (y-yA)^2 < radius^2) * 0.4
#     pic[floor(h-y),,2] = 0.4;
#     pic[,floor(x),2] = 0.4;
#     return(pic)
# }