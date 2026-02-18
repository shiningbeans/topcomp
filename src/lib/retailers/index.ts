import { RetailerAdapter } from './types';
import { AmazonAdapter } from './amazon';
import { BestBuyAdapter } from './bestbuy';
import { WalmartAdapter } from './walmart';
import { EbayAdapter } from './ebay';
import { NeweggAdapter, BHPhotoAdapter, MicroCenterAdapter, AdoramaAdapter } from './scraper-major';
import { LenovoAdapter, DellAdapter, HPAdapter, AppleAdapter } from './scraper-manufacturer';
import { CostcoAdapter, SamsClubAdapter, TargetAdapter, OfficeDepotAdapter } from './scraper-warehouse';

export const retailers: RetailerAdapter[] = [
    new AmazonAdapter(),
    new BestBuyAdapter(),
    new WalmartAdapter(),
    new EbayAdapter(),
    new NeweggAdapter(),
    new BHPhotoAdapter(),
    new MicroCenterAdapter(),
    new AdoramaAdapter(),
    new LenovoAdapter(),
    new DellAdapter(),
    new HPAdapter(),
    new AppleAdapter(),
    new CostcoAdapter(),
    new SamsClubAdapter(),
    new TargetAdapter(),
    new OfficeDepotAdapter(),
];
