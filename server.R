library(png)
library(FITSio)
library(astro)
library(magicaxis)

shinyServer(function(input, output, session) {
    
    output$plot1=renderPlot({
        image(x=1:100,
              y=1:100,
              z=matrix(rnorm(10000,mean=5,sd=1),nrow=100,ncol=100),
              col=rainbow(100,start=0,end=0.2),
              xlab="xlab",
              ylab="ylab")
        par(new=TRUE)
        image(x=1:20,
              y=1:20,
              z=matrix(c(1,NA),nrow=20,ncol=20),
              col=rainbow(100,start=0.4,end=0.6),
              ann=F,
              xaxt="n",
              yaxt="n")
        #magplot(c(50,70), c(50,70), type='l', xlab='', ylab='', labels=c(F,F))
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