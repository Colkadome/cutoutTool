shinyServer(function(input, output, session) {
    
    # Sets the background image.
    # Should be reactive to the PNG string.
    observe({
        
        ## AARON's CODE ##
        input$submit
        CATAID=as.numeric(isolate(input$CATAID))
        if(!is.na(CATAID)){
            ##################
            
            #### TEST SHORTER VERSION ###
            # read pixels from file
            pixels = readPNG(paste(mainpath,CATAID,".png",sep=""))
            
            # write to temporary file
            outfile = tempfile(fileext = ".png")
            writePNG(pixels, target = outfile)
            
            # get uri string from file
            uri = dataURI(
                file=outfile,
                mime="image/png")
            
            # delete temporary file
            unlink(outfile)
            ##### SHORTER: #######
#             path = paste(mainpath,CATAID,".png",sep="")
#             uri = dataURI(
#                 file=path,
#                 mime="image/png")
            ######################
            
            # send uri to javascript canvas (SEND WIDTH AND HEIGHT DATA TOO)
            session$sendCustomMessage(
                type = "custom_setImage",
                message = list("src"=uri)
            )
        }
    })
    
    observe({
        input$test_button
        session$sendCustomMessage(
            type = "custom_setItems",
            message = list("ellipses"=list(list("x"=400, "y"=300, "radA"=153.4047, "radB"=40, "rot"=0.4519863)),
                           "points"=list()
            )
        )
    })
    
    ## AARON's CODE ##
    observe({
        imout=input$items
        if(length(imout)>0){
            CATAID=as.numeric(isolate(input$CATAID))
            if(!is.na(CATAID)){
                select=which(tabscale[,1]==CATAID)
                RAscale=(tabscale[select,'RA.right']-tabscale[select,'RA.left'])/(tabscale[select,'pixels']-1)
                Decscale=(tabscale[select,'Dec.bottom']-tabscale[select,'Dec.top'])/(tabscale[select,'pixels']-1)
                RA0=tabscale[select,'RA.left']-RAscale/2
                Dec0=tabscale[select,'Dec.top']-Decscale/2
                ellipout={}
                pointout={}
                if(length(imout$ellipses)>0){
                    for(i in 1:length(imout$ellipses)){
                        ellipout=rbind(ellipout,unlist(imout$ellipses[[i]]))
                    }
                }
                if(length(imout$points)>0){
                    for(i in 1:length(imout$points)){
                        pointout=rbind(pointout,c(unlist(imout$points[[i]]),NA,NA,NA))
                    }
                }
                taboutput=data.frame(x=NULL,y=NULL,radApx=NULL,rot=NULL)
                if(length(imout$ellipses)>0){taboutput=rbind(ellipout)}
                if(length(imout$points)>0){taboutput=rbind(taboutput,pointout)}
                taboutput=as.data.frame(taboutput)
                taboutput=cbind(taboutput, RA0+taboutput[,1]*RAscale, Dec0+taboutput[,2]*Decscale)
                colnames(taboutput)=c('x','y','radApx','radBpx','rot','RAdeg','Decdeg')
                taboutput=cbind(taboutput,rotW2N=taboutput[,'rot']*180/pi)
                taboutput[,'rotW2N']=(0-taboutput[,'rotW2N']) %% 180
                radAdeg=sqrt((taboutput[,'radApx']*RAscale*cos(taboutput[,'rotW2N']*pi/180))^2+(taboutput[,'radApx']*Decscale*sin(taboutput[,'rotW2N']*pi/180))^2)
                radBdeg=sqrt((taboutput[,'radBpx']*RAscale*cos((taboutput[,'rotW2N']+90)*pi/180))^2+(taboutput[,'radBpx']*Decscale*sin((taboutput[,'rotW2N']+90)*pi/180))^2)
                radAminsel=which(radBdeg>radAdeg)
                radAmajsel=which(radBdeg<radAdeg)
                radmin=radBdeg;radmin[radAminsel]=radAdeg[radAminsel]
                radmaj=radBdeg;radmaj[radAmajsel]=radAdeg[radAmajsel]
                taboutput[radAminsel,'rotW2N']=taboutput[radAminsel,'rotW2N']+90
                taboutput[,'rotW2N']=taboutput[,'rotW2N'] %% 180
                taboutput=cbind(taboutput,radminasec=radmin*3600,radmajasec=radmaj*3600)
                ellipselocs=1:length(imout$ellipses)
                output$tab1=renderDataTable({
                    as.data.frame(signif(Apv05[Apv05[,1]==CATAID,2:6],8))
                })
                output$tab2=renderDataTable({
                    as.data.frame(signif(taboutput[,6:10],8))
                })
                initials=as.character(input$initials)
                write.table(taboutput,file=paste(mainpath,CATAID,'-',initials,"-apout.dat",sep=""),row.names = FALSE)
            }
        }
    })
    #################
})