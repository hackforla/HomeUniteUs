resource "aws_route53_zone" "main" {
  name = "homeunite.us"
}

resource "aws_route53_zone" "dev" {
  name = "dev.homeunite.us"

  tags = {
    Environment = "dev"
  }
}

resource "aws_route53_record" "dev-ns" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "dev.homeunite.us"
  type    = "NS"
  ttl     = "30"
  records = aws_route53_zone.dev.name_servers
}