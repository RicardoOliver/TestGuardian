terraform {
  required_version = ">= 1.5.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.31"
    }
  }
}

variable "namespace_prefix" {
  type    = string
  default = "qaops"
}

locals {
  environments = ["dev", "qa", "uat", "prod"]
}

resource "kubernetes_namespace" "environments" {
  for_each = toset(local.environments)

  metadata {
    name = "${var.namespace_prefix}-${each.value}"
    labels = {
      "app.kubernetes.io/part-of" = "testguardian"
      "qaops/environment"         = upper(each.value)
    }
  }
}
