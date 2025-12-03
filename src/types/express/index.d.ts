import { JwtPayload } from "jsonwebtoken";

declare global{
    namespace express{
         interface request{
            user?: JwtPayload;
         }
    }
}