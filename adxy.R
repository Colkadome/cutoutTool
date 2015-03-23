adxy=function(hdr,coords) {

    	CDELT<-as.numeric(c(hdr[which(hdr=="CDELT1")+1],hdr[which(hdr=="CDELT2")+1]))    
    	if (is.finite(CDELT[1])==F) {CDELT<-as.numeric(c(hdr[which(hdr=="CD1_1")+1],hdr[which(hdr=="CD2_2")+1]))}
    	CRPIX<-as.numeric(c(hdr[which(hdr=="CRPIX1")+1],hdr[which(hdr=="CRPIX2")+1]))
   	CRVAL<-as.numeric(c(hdr[which(hdr=="CRVAL1")+1],hdr[which(hdr=="CRVAL2")+1]))
 

     	 x0 <- CRPIX[1]
     	 y0 <- CRPIX[2]
     	 ra0<-CRVAL[1]*(pi/180)
    	  dec0<-CRVAL[2]*(pi/180)
    	  ra<-coords[1]*(pi/180)
    	  dec<-coords[2]*(pi/180)
  	xscale<-CDELT[1]*(pi/180)
  	yscale<-CDELT[2]*(pi/180)
  	xx <- function(ra0,dec0,ra,dec){
         	 (cos(dec)*sin(ra-ra0))/(sin(dec0)*sin(dec)+(cos(dec0)*cos(dec)*cos(ra-ra0)))
  	}
 	yy <- function(ra0,dec0,ra,dec){
          	((cos(dec0)*sin(dec))-(sin(dec0)*cos(dec)*cos(ra-ra0)))/(sin(dec0)*sin(dec)+(cos(dec0)*cos(dec)*cos(ra-ra0)))
  	}
  	coords[1] <- (xx(ra0,dec0,ra,dec)/tan(xscale)) + x0
  	coords[2] <- (yy(ra0,dec0,ra,dec)/tan(yscale)) + y0


    	return=coords
    
}
